import Items from '../components/Items';

const ShopPage = ({ query }) => (
  <div>
    <Items page={parseFloat(query.page) || 1} />
  </div>
);

export default ShopPage;
