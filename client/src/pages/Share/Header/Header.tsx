import { Nav, Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/img/logo.webp";

const Header = () => {
  return (
    <header className='header'>
      <Nav className='header__nav'>
        <div className='header__nav__logo'>
          <NavLink to='/' className='header__nav__logo'>
            <img src={logo} alt='logo.webp' />
          </NavLink>
        </div>

        <ul className='header__nav__list'>
          <li>
            <NavLink to='/about'>About Us</NavLink>
          </li>
          <li style={{ position: "relative" }}>
            <NavLink to='/all-books'>
              All Books
              <i className='fas fa-angle-down'></i>
            </NavLink>

            <div className='header__nav_list--dropdown'>
              <Row>
                <Col lg={3}>
                  <div className='header__nav_list--dropdown__sidebar'>
                    <div>
                      <div className='header__nav_list--dropdown__sidebar__title'>
                        <h3>Categories</h3>
                      </div>
                      <ul className='header__nav_list--dropdown__sidebar__list'>
                        <li>
                          <NavLink to='/fiction'>Fiction</NavLink>
                        </li>
                        <li>
                          <NavLink to='/non-fiction'>Non-Fiction</NavLink>
                        </li>
                        <li>
                          <NavLink to='/science'>Science</NavLink>
                        </li>
                        <li>
                          <NavLink to='/history'>History</NavLink>
                        </li>
                        <li>
                          <NavLink to='/biography'>Biography</NavLink>
                        </li>
                      </ul>
                    </div>

                    <NavLink
                      to='/all-books'
                      className='header__nav_list--dropdown__sidebar__link'>
                      <span>Browse All Books</span>
                      <i className='fa-solid fa-arrow-right'></i>
                    </NavLink>
                  </div>
                </Col>

                <Col lg={9} className='header__nav_list--dropdown__content'>
                  <Row>
                    <Col lg={4}>
                      <h3>New Arrivals</h3>
                    </Col>
                    <Col lg={7} offset-lg={1}>
                      <div className='header__nav_list--dropdown__search'>
                        <i className='fas fa-search'></i>
                        <input
                          type='text'
                          placeholder='Search for all books & authors'
                        />
                      </div>
                    </Col>
                  </Row>
                  <Container className='header__nav_list--dropdown__carousel__wrapper'>
                    <div className='header__nav_list--dropdown__carousel'>
                      <div
                        className='header__nav_list--dropdown__carousel__slider'
                        id='slider'></div>
                    </div>
                    <div className='header__nav_list--dropdown__carousel__controls'>
                      <button id='prevBtn'>
                        <i className='fa-solid fa-arrow-left'></i>
                      </button>
                      <button id='nextBtn'>
                        <i className='fa-solid fa-arrow-right'></i>
                      </button>
                    </div>
                  </Container>
                </Col>
              </Row>
            </div>
          </li>
          <li>
            <NavLink to='/blog'>Blog</NavLink>
          </li>
          <li>
            <NavLink to='/auth'>My Account</NavLink>
          </li>
        </ul>

        <div className='header__nav__elementor'>
          <div id='cart' className='empty'>
            <div className='header__nav__elementor--item notify' data-count='0'>
              <i className='fas fa-shopping-cart'></i>
            </div>
          </div>

          <div id='wishlist' className='empty'>
            <div className='header__nav__elementor--item notify' data-count='0'>
              <i className='far fa-heart'></i>
            </div>
          </div>

          <div id='bars'>
            <div className='header__nav__elementor--item header__nav__elementor--bars'>
              <i className='fa-solid fa-bars'></i>
            </div>
          </div>
        </div>
      </Nav>
    </header>
  );
};

export default Header;
