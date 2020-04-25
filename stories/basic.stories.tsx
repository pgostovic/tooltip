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

const UL = styled.ul`
  margin: 0;
  padding-left: 20px;
  li {
    margin: 0;
    padding: 0;
  }
`;

const POTATOES = (
  <div>
    Here&apos;s an unordered list...
    <UL>
      <li>One potato</li>
      <li>Two potato</li>
      <li>Three</li>
    </UL>
  </div>
);

const P = styled.div`
  margin: 20px 0;
`;

export const Basic: FC = () => (
  <Root>
    <h3>Hover over the yellow to see tooltips.</h3>
    <P>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a aliquam libero.
      Vestibulum nisi ipsum, mollis vitae justo sit amet, blandit feugiat purus. Mauris ullamcorper
      tempus erat, vel blandit metus feugiat in. Nam congue scelerisque leo nec viverra. Nunc cursus
      dignissim augue. Orci varius natoque <TT tip="Default tooltip, no props.">penatibus</TT> et
      magnis dis parturient montes, nascetur ridiculus mus. Integer semper nulla eu condimentum
      elementum. Quisque non erat ut nisi placerat fermentum in nec felis. Etiam feugiat in lorem ut
      tristique.
    </P>
    <P>
      Aliquam in enim facilisis felis vulputate pellentesque. Nullam vel ipsum faucibus, rutrum
      tellus non, dictum odio.{' '}
      <TT tip="Location bottom" location="bottom">
        Maecenas
      </TT>{' '}
      tincidunt lectus sed faucibus interdum. Nullam vitae lectus a enim ullamcorper mattis a ut
      turpis. Aenean tristique dapibus tincidunt. Duis faucibus elit nisl, sit amet aliquam orci
      sodales eu. Nullam{' '}
      <TT tip="Location left" location="left">
        venenatis
      </TT>{' '}
      metus quis ante ornare, eget tincidunt lacus placerat. Fusce lobortis a erat ac pretium. Donec
      ac sodales elit. Aliquam erat volutpat. Cras vehicula mi vel nibh imperdiet pretium. Morbi a
      eleifend sapien. Ut faucibus euismod mauris, sed aliquam eros.
    </P>
    <P>
      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
      Integer congue justo quis blandit tempus.{' '}
      <TT tip="Location right" location="right">
        Pellentesque
      </TT>{' '}
      non cursus lectus. Nunc euismod neque sed nisi faucibus rhoncus. Mauris fringilla tempor dolor
      id egestas. Vivamus orci purus, eleifend vitae lacus ut, tincidunt sagittis nunc. Suspendisse
      et hendrerit risus, sed euismod neque. <TT tip={LONG_TIP}>Pellentesque</TT> vestibulum
      ultrices purus eu viverra. Curabitur in velit pretium, rutrum tellus ut, vestibulum magna.
      Phasellus venenatis laoreet eros, non consequat dui imperdiet sed. Morbi nec consequat libero.
      Nullam nec interdum enim.
    </P>
    <P>
      Integer in lacinia elit. Sed porta tempus leo, quis tempor enim pellentesque vel. Quisque
      finibus euismod pellentesque. Suspendisse ullamcorper eros justo, eget vulputate ex ultrices
      sit amet. Aliquam facilisis sem a sapien gravida semper. Suspendisse finibus quam ligula, at
      pretium mi eleifend ac. Duis <TT tip={POTATOES}>eleifend</TT> blandit vestibulum. Suspendisse
      ut erat nec purus facilisis convallis eu quis erat. Etiam ut diam a dui dignissim tempus et
      sit amet velit. Donec nec tortor ac nisi sodales sodales. Vivamus auctor orci nulla, in semper
      elit aliquet non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id aliquet
      felis, ac egestas lacus.
    </P>
    <P>
      Cras quis diam massa. Donec vel risus elit. Morbi ut erat nec orci pulvinar tincidunt non a
      sapien. Sed nec convallis felis. In nisi odio, iaculis vitae risus sit amet, lobortis iaculis
      purus. Etiam dui lorem, aliquam in erat sit amet, ultrices venenatis nibh. Donec laoreet velit
      ac tortor rutrum consequat. Curabitur ultricies vitae sapien vel condimentum. Morbi blandit
      euismod lacus vel tempor. Aliquam at turpis placerat, condimentum lacus non, rhoncus metus.
      Donec tincidunt nunc augue, vel congue felis dictum eu. Mauris vel laoreet nisi.
    </P>
  </Root>
);

const LONG_TIP = `Cras quis diam massa. Donec vel risus elit. Morbi ut erat nec orci pulvinar tincidunt non a
sapien. Sed nec convallis felis. In nisi odio, iaculis vitae risus sit amet, lobortis iaculis
purus. Etiam dui lorem, aliquam in erat sit amet, ultrices venenatis nibh. Donec laoreet velit
ac tortor rutrum consequat. Curabitur ultricies vitae sapien vel condimentum. Morbi blandit
euismod lacus vel tempor. Aliquam at turpis placerat, condimentum lacus non, rhoncus metus.
Donec tincidunt nunc augue, vel congue felis dictum eu. Mauris vel laoreet nisi.`;
