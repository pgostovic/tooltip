/* eslint-disable react/jsx-no-literals */
import React, { FC } from 'react';
import styled from 'styled-components';

import Tooltip from '../src';

export default {
  title: 'Tooltip',
  component: Tooltip,
};

const Root = styled.div`
  line-height: 1.5;
  font-family: sans-serif;
  font-size: 14px;
`;

const TT = styled(Tooltip)`
  background-color: yellow;
`;

export const Dialog: FC = () => (
  <Root>
    Click{' '}
    <TT tip={DialogTip} clickToShow interactable>
      here
    </TT>{' '}
    to open a dialog.
  </Root>
);

const DialogTip: FC<{ onHide(): void }> = ({ onHide }) => (
  <div>
    Dialog<button onClick={onHide}>Close</button>
  </div>
);
