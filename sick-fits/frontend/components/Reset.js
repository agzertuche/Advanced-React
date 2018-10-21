import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleReset = async (event, resetMutation) => {
    event.preventDefault();
    await resetMutation();
    this.setState({
      password: '',
      confirmPassword: '',
    });
  };

  render() {
    const { confirmPassword, password } = this.state;
    const { resetToken } = this.props;
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken,
          password,
          confirmPassword,
        }}
        refetchQueries={[
          {
            query: CURRENT_USER_QUERY,
          },
        ]}
      >
        {(reset, { error, loading }) => (
          <Form method="post" onSubmit={e => this.handleReset(e, reset)}>
            <fieldset disabled={loading} aria-disabled={loading}>
              <h2>Reset your password</h2>
              <ErrorMessage error={error} />
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="password"
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm password"
                  onChange={this.saveToState}
                  required
                />
              </label>
              <button type="submit">Reset your password!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Reset;
