import React from 'react'
import { Line } from 'react-chartjs-2'
import { findPriceAt, Listing } from 'core/listing'
import { format } from 'date-fns'
import { enCA } from 'date-fns/locale'
import { getStoreColor } from 'utils/constants'

type Props = {
  listings: Listing[]
}

export default function ListingsChart({ listings }: Props) {
  const dates = Array.from(Array(31).keys())
    .map((day) => {
      const date = new Date()
      date.setDate(date.getDate() - day)
      return date
    })
    .reverse()

  const data: Chart.ChartData = {
    labels: dates,
    datasets: listings?.map((l) => {
      const storeColor = getStoreColor(l.store)
      return {
        label: l.name,
        borderWidth: 5,
        borderColor: storeColor,
        fill: false,
        lineTension: 0,
        data: dates.map((d) => findPriceAt(l, d)?.value),
        steppedLine: 'middle',
        pointRadius: 1,
        pointHoverRadius: 5,
        pointBackgroundColor: storeColor,
        pointHoverBackgroundColor: storeColor,
        pointHitRadius: 5,
      }
    }),
  }

  const options: Chart.ChartOptions = {
    legend: {
      display: false,
    },
    hover: {
      mode: 'point',
    },
    tooltips: {
      bodyFontSize: 16,
      titleFontSize: 16,
      mode: 'point',
      caretSize: 10,
      callbacks: {
        title: (items, data) =>
          format(new Date(items[0].label), 'iiii, d LLLL uuuu', {
            locale: enCA,
          }),
        label: (item, data) => `$${parseFloat(item.value).toFixed(2)}`,
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            callback: (value: number) => `$${value.toFixed(2)}`,
            fontSize: 16,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: (value) =>
              [
                `${format(new Date(value), 'iii', {
                  locale: enCA,
                })}`,
                `${format(new Date(value), 'd LLL', {
                  locale: enCA,
                })}`,
                `${format(new Date(value), 'yy', {
                  locale: enCA,
                })}`,
              ] as unknown as string,
            fontSize: 16,
            autoSkipPadding: 50,
            maxRotation: 0,
          },
        },
      ],
    },
  }

  return <Line data={data} options={options} />
}
