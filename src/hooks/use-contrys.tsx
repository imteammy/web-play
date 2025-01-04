import { useQuery } from '@tanstack/react-query'
import React from 'react'
export type Country = {
    name: string
    enName: string
    alpha2: string
    alpha3: string
    numeric: string
    iso3166_2: string
}

export function useContrys() {
    return useQuery<Country[]>({
        queryKey: ["countries"],
        queryFn: async () => {
            const response = await fetch('https://raw.githubusercontent.com/ponlawat-w/country-list-th/refs/heads/master/country-list-th.json')
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        },
    })
}
