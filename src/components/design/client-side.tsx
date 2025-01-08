"use client";
import { type PropsWithChildren, useEffect, useState } from 'react'

export function ClientSide({ children }: PropsWithChildren) {
    const [client, setClient] = useState(false)

    useEffect(() => {
        setClient(true)
    }, [])


    if (!client) {
        return <></>
    }

    return children
}
