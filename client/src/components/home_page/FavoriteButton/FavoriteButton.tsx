import ClickableIcon from "../../common/ClickableIcon";
import "../Button.css";
import { HeartFill, Heart } from "react-bootstrap-icons";

interface FavoriteButtonProps {
  isLiked: boolean;
  callback: () => void;
}

const FavoriteButton = ({ isLiked, callback }: FavoriteButtonProps) => {
  return (
  <div className="button" onClick={callback}>
    <ClickableIcon icon={isLiked ? <HeartFill color="red"/> : <Heart/>} />
  </div>
  );
};

export default FavoriteButton;
