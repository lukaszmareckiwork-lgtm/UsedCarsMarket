import "./OwnedOffersButton.css";
import IconCounterButton from "../IconCounterButton/IconCounterButton";
import { IoDocuments } from "react-icons/io5";
import { ROUTES } from "../../Routes/Routes";
import { useAuth } from "../../Context/useAuth";

type Props = {
  count: number;
};

const OwnedOffersButton = ({ count }: Props) => {
  const { user } = useAuth();

  return (
    <IconCounterButton
      className="ocb-icn"
      count={count}
      route={ROUTES.CREATED_BY_BUILD(user?.id!)}
      icon={<IoDocuments size={28} />}
      ariaLabel={"My offers"}
      //   onClick={handleClick}
      disabled={count < 1}
    />
  );
};

export default OwnedOffersButton;
