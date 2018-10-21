import ViewItem from '../components/ViewItem';

const ViewItemPage = ({ query }) => (
  <div>
    <ViewItem id={query.id} />
  </div>
);

export default ViewItemPage;
