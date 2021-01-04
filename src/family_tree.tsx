import React from 'react'

type PersonNodeParams = {
    id: number,
    x: number,
    y: number,
    size?: number,
}

const PersonName: React.FC<{width: number, height: number, name: string}> = ({width, height, name}) => {
    const x = width / 2
    const fontSize = height * 0.8
    return (
    <text x={x} y={height} textAnchor='middle' fontWeight='bold' fontSize={fontSize}>{name}</text>
    )
}

const PersonDate: React.FC<{width: number, height: number, value: string}> = ({width, height, value}) => {
    const x = width / 2
    const fontSize = height * 0.5
    return (
        <text x={x} y={height} textAnchor='middle' fontSize={fontSize}>{value}</text>
    )
}

const PersoNodeFrame : React.FC<{gap: number, width: number, height: number}> = ({gap, width, height}) => {
    const infoWidth = width - 2 * gap
    const infoHeight = height - 2 * gap
    return (
        <g>
            <rect x={0} y={0} rx={8} ry={8} width={width} height={height} fill='transparent' stroke='#e0e0eb'/>
            <rect x={gap} y={gap} rx={8} ry={8} width={infoWidth} height={infoHeight} strokeWidth={1} fill='url(#male)'/>
        </g>
    )
}

const PersonNodeBox : React.FC<{ width: number, height: number}> = ({width, height}) => {
        const gap = 0.06 * width
        const infoWidth = width - 2 * gap
        const infoHeight = height - 2 * gap
        return (
        <g>
            <PersoNodeFrame gap={gap} width={width} height={height}/>
            <g transform={`translate(${gap} ${gap})`}>
                <PersonName width={infoWidth} height={infoHeight*0.25} name="Jan"/>
            </g>
            <g transform={`translate(${gap} ${gap+infoHeight*0.25})`}>
                <PersonName width={infoWidth} height={infoHeight*0.25} name='Laštovička'/>
            </g>
            <g transform={`translate(${gap} ${gap+infoHeight*0.5})`}>
                <PersonDate width={infoWidth} height={infoHeight*0.25} value="* 11.11. 1983"/>
            </g>
        </g>
        )
}



const PersonNode : React.FC<PersonNodeParams> = ({x, y, size=150}) => {

    const infoEnvelopeWidth = size;
    const infoEnvelopeHeight = 0.5 * size;

    {/*<image x={pictureX} y={0} width={pictureWidth} height={pictureHeight} href="/1.jpg"/>*/}
    return (
        <g transform={`translate(${x} ${y})`}>
            <PersonNodeBox width={infoEnvelopeWidth} height={infoEnvelopeHeight}/>
        </g>
    )
}

const FamilyTree : React.FC<{}> = () => {
    return (
        <svg width='100%' height={500}>
            <defs>
                <linearGradient id="male" x1={0} y1={0} x2={1} y2={1}>
                    <stop offset="0%" stopColor='#66a3ff'/>
                    <stop offset="100%" stopColor='white'/>
                </linearGradient>
                <linearGradient id="female" x1={0} y1={0} x2={1} y2={1}>
                    <stop offset="0%" stopColor='#ffb3b3'/>
                    <stop offset="100%" stopColor='white'/>
                </linearGradient>
            </defs>
            <PersonNode id={1} x={50} y={100}/>  
        </svg>
    )
}

export { FamilyTree }