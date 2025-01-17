import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import makeEntity from '../src/makeEntity';

let hookValue = null;
let component = null;

let useCounter = null;

const CounterView = () => {
  hookValue = useCounter();

  return null;
};

beforeAll(() => {
  const initialState = {
    value: 0,
    wasReset: false,
  };

  const increment = counter => () => {
    counter.setState({ value: counter.state.value + 1 });
  };

  const decrement = counter => () => {
    counter.setState({ value: counter.state.value - 1 });
  };

  const reset = counter => () => {
    counter.setState({ value: 0, wasReset: true });
  };

  const hasBeenReset = counter => () => {
    return counter.state.wasReset;
  };

  useCounter = makeEntity({
    initialState,
    increment,
    decrement,
    reset,
    hasBeenReset,
  });
});

beforeEach(() => {
  component = mount(<CounterView />);
});

afterEach(() => {
  if (component.exists()) component.unmount();
});

describe('makeEntity', () => {
  it('returns an entity hook function', () => {
    expect(useCounter).toBeInstanceOf(Function);
    expect(hookValue).toBeInstanceOf(Array);
    expect(hookValue).toHaveLength(2);
  });

  it('sets the initial state of the entity', () => {
    const counter = hookValue[0];
    expect(counter).toHaveProperty('value', 0);
  });

  it('passes the current state of the entity to actions in the argument object', () => {
    const { hasBeenReset } = hookValue[1];
    const wasReset = hasBeenReset();
    expect(wasReset).toBeDefined();
    expect(wasReset).toBe(false);
  });

  it('passes the `setState` of the entity to actions in the argument object', () => {
    const { reset, hasBeenReset } = hookValue[1];
    act(() => {
      reset();
    });
    const wasReset = hasBeenReset();
    expect(wasReset).toBe(true);
  });
});
