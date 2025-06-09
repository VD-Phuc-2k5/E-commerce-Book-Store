import { loadDB } from "../db.js";
import getCurrentDateTime from "../modules/getCurrentDate.js";

export async function getAccounts(req, res) {
  const db = await loadDB();
  return res.status(200).json({
    data: db.data.accounts,
  });
}

export async function signUp(req, res) {
  const db = await loadDB();
  const email = db.data.accounts.find(
    (account) => account.email === req.body.email
  );

  if (email) {
    return res.status(500).json({
      data: {
        status: 500,
        message: "tao tai khoan that bai",
      },
    });
  }

  db.data.accounts.push({
    ...req.body,
    role: "user",
    createdAt: getCurrentDateTime(),
  });

  await db.write();

  return res.status(201).json({
    data: {
      status: 201,
      message: "Đăng ký thành công",
    },
  });
}

export async function logIn(req, res) {
  const db = await loadDB();
  const { email, password } = req.body;

  console.log(email, password);

  const match = db.data.accounts.find(
    (account) => account.email === email && account.password === password
  );

  if (!match) {
    return res.status(500).json({
      data: {
        status: 500,
        message: "Dang nhap that bai",
      },
    });
  }

  return res.status(200).json({
    data: {
      status: 200,
      role: match.role,
      message: "Đăng nhập thành công",
    },
  });
}
