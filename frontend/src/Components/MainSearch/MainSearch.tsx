import "./MainSearch.css";
import OffersList from '@components/OffersList/OffersList';
import OffersFiltersControls from '@components/OffersFiltersControls/OffersFiltersControls';
import ReactPaginate from 'react-paginate';
import { useOfferFilters } from '@helpers/useOffersFilters';
import OffersSortControl from "@components/OffersSortControl/OffersSortControl";
import SEO from '@components/SEO/SEO';

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
      <SEO title="Search — Used Cars Market" description="Search used cars by make, model, price and location. Browse offers with photos and seller details." />
      <div className="main-search-grid">
        <span className="main-search-offers-category-title">Passenger Cars</span>

        <header className="main-search-offers-results-heading">
          <span className="main-search-offers-amount">Offers found: {totalCount}</span>
          <OffersSortControl
            query={query}
            updateFilters={updateFilters}
          />
        </header>

        <OffersFiltersControls
          query={query}
          updateFilters={updateFilters}
          toggleFavouriteFilter={toggleFavouriteFilter}
          offersFound={totalCount}
        />

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
