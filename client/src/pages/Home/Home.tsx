import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Header, Footer } from "../Share/Share";
// import image
import banner from "../../assets/img/banner.jpg";
// import css
import "./css/Home.css";
import "./css/responsive.css";

const Home = () => {
  return (
    <>
      <Header />
      <section id='home'>
        <Container fluid style={{ padding: 0 }}>
          <Row>
            <Col lg={12} className='home__banner'>
              <div className='home__banner__overlay'>
                <div
                  className='home__banner__overlay__title'
                  style={{ color: " #fff" }}>
                  <h3>READ MORE, OFTEN</h3>
                  <h1>Paperbacks in Saigon</h1>
                  <div>
                    <NavLink to='/all-books' style={{ color: "#fff" }}>
                      VISIT STORE
                    </NavLink>
                    <NavLink to='/blog' style={{ color: "#fff" }}>
                      BLOG
                    </NavLink>
                    <NavLink to='/about' style={{ color: "#fff" }}>
                      ABOUT US
                    </NavLink>
                  </div>
                </div>
              </div>
              <img src={banner} width='100%' loading='lazy' />
            </Col>
          </Row>
        </Container>

        <Container>
          <Row className='home__product_list'></Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Home;
