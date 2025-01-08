import Script from 'next/script'
import React from 'react'
import Subform from './subform'

export default function MainSubFormPage() {
    return (
        <>

            <Script
                src="https://unpkg.com/react-scan/dist/auto.global.js"
                strategy='beforeInteractive'
            />
            <Subform />
        </>
    )
}
