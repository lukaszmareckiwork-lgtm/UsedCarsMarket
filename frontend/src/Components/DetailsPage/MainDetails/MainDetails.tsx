import { useEffect, useState } from 'react'
import "./MainDetails.css"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { offerGetSingleApi } from '../../../Services/OfferService'
import { type OfferProps } from '../../../Data/OfferProps'
import DetailsContent from '../DetailsContent/DetailsContent'
import DetailsSidePanel from '../DetailsSidePanel/DetailsSidePanel'
import { IoArrowBackOutline } from 'react-icons/io5'
import Spinner from '../../Spinner/Spinner'


const MainDetails = () => {
  const [offerProps, setOfferProps] = useState<OfferProps>();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {   
    offerGetSingleApi(Number(id))
      ?.then((res) => {
        const numericId = Number(id);
        if (!numericId) return;

        // handleLoadingOffers(false);

        if (res?.data != undefined) {
          setIsLoading(false);
          setOfferProps(res.data);
        }
      });
  }, []);

  if (isLoading) return null;

  return (
    <div className="main-details-wrapper">
      <div className="main-details">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1); // go back to previous page
          }}
          className="main-details-back"
        >
          <IoArrowBackOutline size={16} />Back to your search results
        </Link>
        {!isLoading && <DetailsSidePanel offerProps={offerProps!} />}
        {!isLoading ? (<DetailsContent offerProps={offerProps!}/>) : (<Spinner overlay={true} />)}
      </div>
    </div>
  );
}

export default MainDetails