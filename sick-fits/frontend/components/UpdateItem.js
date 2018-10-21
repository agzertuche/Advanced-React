import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val,
    });
  };

  handleSave = async (event, updateItemMutation) => {
    // Stop the form from submitting
    event.preventDefault();
    // Call mutation
    const { id } = this.props;
    const res = await updateItemMutation({
      variables: {
        id,
        ...this.state,
      },
    });
    // Redirect user to the single item page
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id },
    });
  };

  render() {
    const { id } = this.props;
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id,
        }}
      >
        {({ data, loading: queryLoading }) => {
          if (queryLoading) return <p>Loading...</p>;
          if (!data.item)
            return (
              <p>
                No item found for ID:
                {id}
              </p>
            );

          const { title, price, description } = data.item;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={event => this.handleSave(event, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="0.00"
                        required
                        defaultValue={price}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description..."
                        required
                        defaultValue={description}
                        onChange={this.handleChange}
                      />
                    </label>
                  </fieldset>
                  <button type="submit">Save</button>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
