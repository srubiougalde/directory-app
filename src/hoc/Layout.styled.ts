import styled from 'styled-components'

export const StyledLayout = styled.div`
    display:grid;
    grid-template-areas:
    "header"
    "main";
    grid-template-columns: auto;
    grid-template-rows: 64px calc(100vh - 64px);

`