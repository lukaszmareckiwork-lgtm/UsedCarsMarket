import "./MainSearch.css";
import OffersList from '../OffersList/OffersList';
import OffersFiltersControls from '../OffersFiltersControls/OffersFiltersControls';
import ReactPaginate from 'react-paginate';
import { useOfferFilters } from '../../Helpers/useOffersFilters';

const MainSearch = () => {
  const {
    query,
    offers,
    totalCount,
    loading,
    updateFilters,
    toggleFavouriteFilter,
    onPageChange,
  } = useOfferFilters();

  const handlePageChange = (e: { selected: number }) => {
    onPageChange(e.selected + 1);
  };

  return (
    <div className="main-search">
      <div className="main-search-grid">
        <OffersFiltersControls
          query={query}
          updateFilters={updateFilters}
          toggleFavouriteFilter={toggleFavouriteFilter}
        />

        <span className="main-search-offers-category-title">Passenger Cars</span>
        <span className="main-search-offers-amount">Offers found: {totalCount}</span>

        <OffersList offers={offers} isLoadingOffers={loading} />

        {totalCount > query.PageSize && (
          <ReactPaginate
            className="main-search-pagination"
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={Math.ceil(totalCount / query.PageSize)}
            onPageChange={handlePageChange}
            forcePage={query.PageNumber - 1}
          />
        )}
      </div>
    </div>
  );
};

export default MainSearch;
