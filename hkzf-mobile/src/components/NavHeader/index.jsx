import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
import PropTypes from 'prop-types'
import style from "./index.module.css";

export default function NavHeader(props) {

  NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onBack: PropTypes.func
  }

  const navigate = useNavigate();

  // 默认点击行为
  const defaultHandler = () => {
    navigate(-1);
  };

  return (
    <NavBar className={style.navbar} onBack={props.onBack || defaultHandler}>
      {props.children}
    </NavBar>
  );
}
