import './Offer.css'
import type { JSX } from 'react/jsx-runtime'
import { getReadableCurrencyType, getReadableSellerType, type OfferProps } from '@data/OfferProps'
import ParamsWithIcons from '@components/ParamsWithIcons/ParamsWithIcons'
import PhotoViewer from '@components/DetailsPage/PhotoViewer/PhotoViewer'
import AddFavouritesButton from '@components/AddFavouritesButton/AddFavouritesButton'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@routes/Routes'

const Offer: React.FC<{offerProps: OfferProps}> = ({offerProps: offerProps}): JSX.Element => {
  const location = useLocation();

  return (
    <div className='offer'>
      <article data-id={offerProps.id} className='offer-article' data-media-size='small' data-orientation='horizontal'>
        <Link 
          to={ROUTES.OFFER_DETAILS_BUILD(offerProps.id)}
          state={{ returnTo: location.pathname + location.search }}
        ></Link>
        <section className='offer-section'>
          <div className='offer-image-holder'>
            <PhotoViewer offerProps={offerProps} compact={true} />
          </div>
          <div className='offer-titles'>
            <div className='offer-title-holder'>
              <h2 className='offer-title'>{offerProps.title}</h2>
            </div>
            <p className='offer-subtitle'>{offerProps.subtitle}</p>
          </div>

          <div className='offer-info-panel'>
            <ParamsWithIcons offerProps={offerProps} iconSize={18} hideLabel={true} spaceEvenly={false}/>
            <ul className='offer-info-panel-location-date'>
              <li className='offer-info-panel-list-elem'>
                <p className='offer-info-panel-list-elem-text'>{offerProps.locationName}</p>
              </li>
              <li className='offer-info-panel-list-elem'>
                <p className='offer-info-panel-list-elem-text'>{getReadableSellerType(offerProps.sellerDto.sellerType)} • Published: {offerProps.createdDate.toLocaleString("pl-PL")}</p>
              </li>
            </ul>
          </div>

          <div className='offer-price-panel'>
            <div className='offer-price-holder'>
              <h3 className='offer-price-value'>{Intl.NumberFormat("pl-PL").format(offerProps.price)}</h3>
              <p className='offer-price-currency'>{getReadableCurrencyType(offerProps.currency)}</p>
            </div>
          </div>

          <div className='offer-add-favourite-panel'>
            <AddFavouritesButton offerProps={offerProps} />
          </div>
        </section>
      </article>
    </div>
  )
}

export default Offer