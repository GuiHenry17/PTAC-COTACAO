import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

export default function Cotacao() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [url, setUrl] = useState(null)

  const { data, error, isLoading } = useSWR(url, fetcher);

  const buscarHistorico = (e) => {
    e.preventDefault()
    if (!startDate || !endDate) return alert('Preencha as datas')
    const start = startDate.replaceAll('-', '')
    const end = endDate.replaceAll('-', '')
    setUrl(`https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${start}&end_date=${end}`)
  }

  return (
    <main>
      <h1>Buscar Cotação USD/BRL</h1>

      <form onSubmit={buscarHistorico}>
        <div>
          <label htmlFor="startDate">Data Início:</label><br />
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="endDate">Data Fim:</label><br />
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <button type="submit">Buscar</button>
      </form>

      {isLoading && url && <p>Carregando...</p>}
      {error && <p>Erro ao buscar.</p>}

      {data && data.length > 0 && (
        <section>
          <h2>Resultados:</h2>
          <p><strong>Compra mais recente:</strong> R$ {data[0].bid}</p>
          <p><strong>Venda mais recente:</strong> R$ {data[0].ask}</p>
          <p><strong>Data:</strong> {new Date(data[0].timestamp * 1000).toLocaleDateString()}</p>
          <hr />

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Compra</th>
                <th>Venda</th>
                <th>Alta</th>
                <th>Baixa</th>
                <th>Variação</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.timestamp}>
                  <td>{new Date(item.timestamp * 1000).toLocaleDateString()}</td>
                  <td>{item.bid}</td>
                  <td>{item.ask}</td>
                  <td>{item.high}</td>
                  <td>{item.low}</td>
                  <td>{item.varBid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
