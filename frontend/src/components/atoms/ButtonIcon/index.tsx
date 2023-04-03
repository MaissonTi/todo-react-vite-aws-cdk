import styled, { css }  from 'styled-components'

interface Props {
  color?: string;
  theme: {[key: string]: string};
}

function color({ color = '#ffffff00', theme }: Props){
  if(theme[color]){
    return theme[color]
  }
  return color
}

export const ButtonIcon = styled.button<Props>`
  all: 'unset';
  width: 3rem;
  height: 3rem;
  border: 0px;
  background: #ffffff0a;  
  font-weight: bold;
  border-radius: 100%;
  cursor: pointer;  
  align-items: center;
  display: flex;
  justify-content: center;

  ${(props) =>
    props.color &&
    css`
      color: ${color(props)};
    `}

  &:hover {
    background: #ffffff24;
    transition: background-color 0.2s;
  }
`