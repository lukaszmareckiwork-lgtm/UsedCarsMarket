import { useEffect, useState } from 'react'
import "./MainDetails.css"
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { offerGetSingleApi } from '../../../Services/OfferService'
import { type OfferProps } from '../../../Data/OfferProps'
import DetailsContent from '../DetailsContent/DetailsContent'
import DetailsSidePanel from '../DetailsSidePanel/DetailsSidePanel'
import { IoArrowBackOutline } from 'react-icons/io5'
import Spinner from '../../Spinner/Spinner'
import { useRedirectBack } from '../../../Helpers/useRedirectBack'


const MainDetails = () => {
  const [offerProps, setOfferProps] = useState<OfferProps>();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { redirect } = useRedirectBack();

  useEffect(() => {   
    offerGetSingleApi(Number(id))
      ?.then((res) => {
        const numericId = Number(id);
        if (!numericId) return;

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
            redirect();
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