import ClickableIcon from "../../common/ClickableIcon";
import "../Button.css";
import { HeartFill, Heart } from "react-bootstrap-icons";

interface FavoriteButtonProps {
  isLiked: boolean;
  callback: () => void;
}

/**
 * A button that allows the user to like or unlike an image. The button displays a filled heart icon if the image is
 * liked, and an empty heart icon if the image is not liked.
 * 
 * Props:
 * - `isLiked` (boolean): A boolean value that indicates whether the image is liked.
 * - `callback` (function): A callback function that is called when the button is clicked. It should handle the like/unlike
 *  operation and update the parent component's state.
 * 
 */
const FavoriteButton = ({ isLiked, callback }: FavoriteButtonProps) => {
  return (
  <div className="button" onClick={callback} data-testid="favorite-button">
    <ClickableIcon icon={isLiked ? <HeartFill color="red" data-testid="filled-heart"/> : <Heart data-testid="empty-heart"/>} />
  </div>
  );
};

export default FavoriteButton;
