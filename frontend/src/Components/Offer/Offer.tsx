import './Offer.css'
import type { JSX } from 'react/jsx-runtime'
import { getReadableCurrencyType, getReadableSellerType, type OfferProps } from '../../Data/OfferProps'
import ParamsWithIcons from '../ParamsWithIcons/ParamsWithIcons'
import PhotoViewer from '../DetailsPage/PhotoViewer/PhotoViewer'
import AddFavouritesButton from '../AddFavouritesButton/AddFavouritesButton'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../Routes/Routes'

const Offer: React.FC<{offerProps: OfferProps}> = ({offerProps: offerProps}): JSX.Element => {
  const location = useLocation();

  return (
    <div className='offer'>
      <article data-id={offerProps.id} className='offerArticle' data-media-size='small' data-orientation='horizontal'>
        <Link 
          to={ROUTES.OFFER_DETAILS_BUILD(offerProps.id)}
          state={{ from: location.pathname + location.search }}
        ></Link>
        <section className='offerSection'>
          <div className='offerImageHolder'>
            <PhotoViewer offerProps={offerProps} compact={true} />
          </div>
          <div className='offerTitles'>
            <div className='offerTitleHolder'>
              <h2 className='offerTitle'>{offerProps.title}</h2>
            </div>
            <p className='offerSubtitle'>{offerProps.subtitle}</p>
          </div>

          <div className='offerInfoPanel'>
            <ParamsWithIcons offerProps={offerProps} iconSize={18} hideLabel={true} spaceEvenly={false}/>
            <ul className='offerInfoPanelLocationDate'>
              <li className='offerInfoPanelListElem'>
                <p className='offerInfoPanelListElemText'>{offerProps.locationName}</p>
              </li>
              <li className='offerInfoPanelListElem'>
                <p className='offerInfoPanelListElemText'>{getReadableSellerType(offerProps.sellerDto.sellerType)} • Published: {offerProps.createdDate.toLocaleString("pl-PL")}</p>
              </li>
            </ul>
          </div>

          <div className='offerPricePanel'>
            <div className='offerPriceHolder'>
              <h3 className='offerPriceValue'>{Intl.NumberFormat("pl-PL").format(offerProps.price)}</h3>
              <p className='offerPriceCurrency'>{getReadableCurrencyType(offerProps.currency)}</p>
            </div>
          </div>

          <div className='offerAddFavouritePanel'>
            <AddFavouritesButton offerProps={offerProps} />
          </div>
        </section>
      </article>
    </div>
  )
}

export default Offer