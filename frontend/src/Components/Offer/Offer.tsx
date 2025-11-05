import './Offer.css'
import OfferParamsWithIcons from '../OfferParamsWithIcons/OfferParamsWithIcons'
import AddFavouriteButton from '../AddFavouriteButton/AddFavouriteButton'
import type { JSX } from 'react/jsx-runtime'
import { getReadableSellerType, type OfferProps } from '../../Data/OfferProps'

const Offer: React.FC<{offerProps: OfferProps}> = ({offerProps: offerProps}): JSX.Element => {
  return (
    <div className='offer'>
      <article data-id='111' className='offerArticle' data-media-size='small' data-orientation='horizontal'>
        <section className='offerSection'>
          <div className='offerImageHolder'>
            <img className='offerImage' alt='' loading='eager' src='https://ireland.apollo.olxcdn.com/v1/files/i6ctks32d9cz2-OTOMOTOPL/image;s=320x240'></img>
          </div>

          <div className='offerTitles'>
            <div className='offerTitleHolder'>
              <h2 className='offerTitle'>{offerProps.title}</h2>
            </div>
            <p className='offerSubtitle'>{offerProps.subtitle}</p>
          </div>

          <div className='offerInfoPanel'>
            <OfferParamsWithIcons />
            <ul className='offerInfoPanelLocationDate'>
              <li className='offerInfoPanelListElem'>
                <p className='offerInfoPanelListElemText'>{offerProps.location}</p>
              </li>
              <li className='offerInfoPanelListElem'>
                <p className='offerInfoPanelListElemText'>{getReadableSellerType(offerProps.sellerType)} • Published: {offerProps.createdDate.toLocaleDateString("pl-PL")}, {offerProps.createdDate.toLocaleTimeString("pl-PL")}</p>
              </li>
            </ul>
          </div>

          <div className='offerPricePanel'>
            <div className='offerPriceHolder'>
              <h3 className='offerPriceValue'>{Intl.NumberFormat("pl-PL").format(offerProps.price)}</h3>
              <p className='offerPriceCurrency'>{offerProps.currency}</p>
            </div>
          </div>

          <div className='offerAddFavouritePanel'>
            <AddFavouriteButton />
          </div>
        </section>
      </article>
    </div>
  )
}

export default Offer