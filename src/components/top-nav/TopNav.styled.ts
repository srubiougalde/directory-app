import styled from 'styled-components'
import { PRIMARYCOLOR } from '../../Utils'

export const StyledTopNav = styled.nav`
    height: 64px;
    width: 100%;
    grid-area: header;
    display:grid;
    grid-template-columns:1fr 1fr;
    background:#212531;
    background: linear-gradient(150deg, ${PRIMARYCOLOR} 50%, white 50%);
`

export const StyledTopNavLeft = styled.div`
    display:flex;
    align-items:center;
    width:100%;
    color: white;
    padding: 0px 16px;
    > span {
        font-size: 24px;
        line-height: 28px;
    }
    label {
        font-size: 20px;
        line-height: 28px;
    }
`
export const StyledTopNavRight = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-end;
    width:100%;
    color: #5E5E5E;

    > span {
        margin: 0 16px;
    }
`