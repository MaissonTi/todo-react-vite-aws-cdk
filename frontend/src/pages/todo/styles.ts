import styled from 'styled-components'
import img from '../../assets/empty-content.svg'

export const TodoContainer = styled.main`
  width: 100%;
  max-width: 820px;
  margin: 4rem auto 0;
  padding: 0 1.5rem;  

  .progress-bar{    
    margin: 1.5rem;
  }
`

export const TodoEmpty = styled.div`
  height: 50vh;
  width: 100%;
  background-image: ${() => `url(${img})`};   
  background-repeat: no-repeat;  
  background-position: center;
`
export const TodoEmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  

  h1{
    color: ${(props) => props.theme['neutrals-300']};
    letter-spacing: 0.5rem
  }
`

