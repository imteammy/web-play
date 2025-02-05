import Script from 'next/script'
import React from 'react'
import MainPage from './form_page'
export default function BaseFormPage() {
    return (
        <>
            <Script
                src="https://unpkg.com/react-scan/dist/auto.global.js"
                strategy='beforeInteractive'
            />
            <MainPage />
        </>
    )
}
