import styled from 'styled-components'

export const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    margin: 0.5rem;   
    
    button {
        background: ${(props) => props.theme['neutrals-700']};
        color: ${(props) => props.theme['neutrals-300']};
        box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
    }
`

