import React from 'react'
import ReactDOM from 'react-dom'

import { FamilyTree } from './family_tree'

const App : React.FunctionComponent = () => {
    return <FamilyTree/>
}

ReactDOM.render(<App/>, document.querySelector("#content"));