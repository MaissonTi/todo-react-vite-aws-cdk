import styled from 'styled-components'

export const Input = styled.input`      
    border-radius: 6px;
    border: 0;
    background: ${(props) => props.theme['neutrals-900']};
    color: ${(props) => props.theme['neutrals-300']};
    padding: 1rem;
    
    &::placeholder {
        color: ${(props) => props.theme['neutrals-500']};
    }  
    
    &:focus {
        outline: 0;
        box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
    }
`