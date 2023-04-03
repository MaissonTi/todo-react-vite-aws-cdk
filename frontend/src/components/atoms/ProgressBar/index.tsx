import styled from 'styled-components'

export const Container = styled.div`  
  height: 4px;
  background-color: ${(props) => props.theme['green-500']};
  width: 100%;
  overflow: hidden;
`

export const ContainerValue = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme['neutrals-700']};
  animation: indeterminateAnimation 1s infinite linear;
  transform-origin: 0% 50%;

  @keyframes indeterminateAnimation { 
    0% {
        transform:  translateX(0) scaleX(0);
    }
    40% {
        transform:  translateX(0) scaleX(0.4);
    }
    100% {
        transform:  translateX(100%) scaleX(0.5);
    }
  }
`
export function ProgressBar() {
    return ( 
      <div className='progress-bar'>
        <Container >
          <ContainerValue/>
        </Container>
      </div>
    )
}