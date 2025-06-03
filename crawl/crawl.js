import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { info } from "console";

// support func
async function scrollToBottom(page, delay = 1000, maxScrolls = 10) {
  console.log(`++ Đang scroll để load thêm sản phẩm...`);

  for (let i = 0; i < maxScrolls; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// main func
(async () => {
  console.log("Bắt đầu crawl dữ liệu sách...");
  const BASE_URL = "https://tiki.vn/sach-truyen-tieng-viet/c316";

  // Khởi tạo browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--window-size=1920,1080",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--lang=vi-VN,vi",
    ],
  });

  // Mo mot trang moi
  const page = await browser.newPage();

  // Thiết lập User-Agent để giả lập trình duyệt thật
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );

  // Mảng chứa nhung cuon sach
  let allBooks = [];

  // Số trang cần crawl
  const pagesToCrawl = 1;

  // === lay du lieu === /
  try {
    // lay tat ca san pham co trong tung trang
    for (let currentPage = 1; currentPage <= pagesToCrawl; currentPage++) {
      console.log(`+ Đang crawl trang ${currentPage}/${pagesToCrawl}...`);

      // chuyen toi trang hien tai cua base url
      await page.goto(`${BASE_URL}?page=${currentPage}`, {
        waitUntil: "networkidle2",
      });

      // Đợi để trang load đầy đủ
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Scroll để load thêm sản phẩm
      await scrollToBottom(page, 1000, 1);

      const pageBooks = await page.evaluate(() => {
        const books = document.querySelectorAll("a.product-item");
        return Array.from(books).map((book) => {
          // get imgurl
          const imgUrl = book
            .querySelector("img.sc-900210d0-0")
            .srcset.split(",")[0];
          const cost = book.querySelector(".price-discount__price").innerText;
          // get discount
          const discountPercent =
            book.querySelector(".price-discount__percent")?.innerText ?? 0;
          // get author
          const author = book.querySelector(".cUhrxa span")?.innerText ?? "";
          // get title
          const title = book.querySelector(".dDeapS").innerText;
          // get rating
          let rating = 0;
          const el = book.querySelector(".sc-980e9960-0 div");
          if (el) {
            const width = parseInt(getComputedStyle(el).width);
            const percent = (width / 60) * 100;
            rating = Number((percent / 20).toFixed(1));
          }

          return {
            imgUrl,
            cost: Number(cost.replace(/[^\d]/g, "")),
            discount: parseInt(discountPercent),
            author,
            title,
            rating,
            link: book.href ?? "",
          };
        });
      });

      console.log(
        `=> Tìm thấy ${pageBooks.length} sản phẩm trên trang ${currentPage}`
      );

      allBooks.push(...pageBooks);

      // Đợi một chút trước khi chuyển sang trang tiếp theo để tránh bị chặn
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 1000)
      );
    }

    // vao trang san pham de lay them cac thong tin chi tiet khac
    for (let idx = 0; idx < allBooks.length; idx++) {
      const book = allBooks[idx];
      if (!book.link) continue;
      try {
        console.log(
          `+ Bắt đầu lấy thông tin chi tiết cho sản phẩm (${idx + 1} / ${
            allBooks.length
          })...`
        );

        await page.goto(book.link, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Đợi trang load
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await scrollToBottom(page, 1000, 5);

        const additionalInfo = await page.evaluate(async (idx) => {
          // get category
          const categories = Array.from(
            document.querySelectorAll(".breadcrumb-item span")
          )?.map((item) => item?.innerText ?? "");
          const category = categories[categories.length - 2];

          // get manufactor
          let manufacturer = "";
          const spans = document.querySelectorAll(".bXjfwR .kdahle");
          manufacturer = spans[spans.length - 1]?.innerText ?? "";

          // get desc
          let description = document.querySelector(".haxTPb")?.innerText ?? "";

          // get n_rating
          let n_rating = document.querySelector("a.number")?.innerText ?? 0;
          if (n_rating) {
            n_rating = parseInt(n_rating.replace(/[()]/g, ""));
          }

          return {
            category,
            manufacturer,
            description,
            n_rating,
            quantity: Math.floor(Math.random() * 100) + 1,
            id: idx,
          };
        }, idx);

        // them thuoc tinh moi vao
        allBooks[idx] = {
          ...allBooks[idx],
          ...additionalInfo,
        };
      } catch (error) {
        console.error(
          `Lỗi khi lấy thông tin chi tiết cho sản phẩm ${book.title}:`,
          error.message
        );
      }
    }

    // Lưu toàn bộ dữ liệu vào file JSON
    const outputDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "db.json");
    fs.writeFileSync(outputPath, JSON.stringify(allBooks, null, 2), "utf8");

    console.log(
      `✅ Đã crawl và lưu thành công ${allBooks.length} cuốn sách vào file ${outputPath}`
    );
  } catch (error) {
    console.error("Lỗi trong quá trình crawl:", error);
  } finally {
    browser.close();
  }
})();
