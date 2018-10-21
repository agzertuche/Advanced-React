import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  handleDelete = deleteItemMutation => {
    if (window.confirm('Are you sure??')) {
      deleteItemMutation();
    }
  };

  updateUI = (cache, payload) => {
    // Manually update cach on the client
    // Read cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

    // Filter the deleted item out of the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );

    // Put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    const { children, id } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.updateUI}
      >
        {(deleteItem, { error }) => (
          <button type="button" onClick={() => this.handleDelete(deleteItem)}>
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
