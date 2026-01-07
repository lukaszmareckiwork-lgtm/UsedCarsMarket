import "./DemoComment.css";

interface Props {
  textContent: string;
  showButton?: boolean;
  onButtonClicked?: () => void;
}

const DemoComment = ({
  textContent,
  showButton = false,
  onButtonClicked = () => null,
}: Props) => {
  return (
    <div className="demo-comment">
      <small className="demo-comment-text">{textContent}</small>
      {showButton && (
        <button onClick={onButtonClicked} className="demo-comment-button">
          Login DEMO Account
        </button>
      )}
    </div>
  );
};

export default DemoComment;
