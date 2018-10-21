import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRequest = async (event, requestMutation) => {
    event.preventDefault();
    const res = await requestMutation();
    this.setState({
      email: '',
    });
  };

  render() {
    const { email } = this.state;
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(request, { error, loading, called }) => (
          <Form method="post" onSubmit={e => this.handleRequest(e, request)}>
            <fieldset disabled={loading} aria-disabled={loading}>
              <h2>Request a password reset</h2>
              <ErrorMessage error={error} />
              {!error &&
                !loading &&
                called && <p>Success! Check your email for a reset link!</p>}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="email"
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Request reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
