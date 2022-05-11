import styled from 'styled-components'

type PageBoxProps = {
    width?: string;
    height?: string;
    marginTop?: string;
}
export const PageBox = styled.div<PageBoxProps>`
    background-color: white;
    width: ${p => p.width ? p.width : '100%'};
    height: ${p => p.height ? p.height : '100%'};
    ${p => p.marginTop ? 'margin-top:' + p.marginTop : ''};
    box-sizing: border-box;
    color: #908787;
    padding: 16px 16px;
    border-radius: 5px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    > h1 {
        font-style: normal;
        font-weight: bold;
        font-size: 30px;
        line-height: 34px;
    }
`