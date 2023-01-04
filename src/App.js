import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import moment from 'moment';
import './App.css';


const url = `https://mainnet.infura.io/v3/64d81e8418bc4d7da8685fe95a85a216`;
const provider = new ethers.providers.JsonRpcProvider(url);

function App() {

  const [blocks, setBlocks] = useState([])
  const [blockData,setBlockData]=useState(null)

  const getBlockDetails = async (block) => {
    const result = await provider.getBlockWithTransactions(block);
    console.log(result)
    setBlocks((curState)=>[{result},...curState])
  }
  
  const setBlockInfo = (blockNumber) => {
    setBlockData(()=>blocks.find(item=>item.result.number===blockNumber))
  }

  const backToAllBlocks = () => {
    setBlockData(null)
  }

  useEffect(() => {
    provider.on("block", (block) => {
      // console.log('listning')
      getBlockDetails(block);
    });
    return () => {
      provider.removeAllListeners()
    }
  }, []);

  return (
    <div className="App">
      <h1>Block Viewer</h1>
      {!blockData && (
        <table>
          <tbody>
            {blocks.length > 0 && (
              <tr>
                <th>Block Number</th>
                <th>Block Hash</th>
                <th>Gas Limit</th>
                <th>Transaction Count</th>
                <th>Time Stamp</th>
              </tr>
            )}
            {blocks.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <span
                      onClick={() => setBlockInfo(item.result.number)}
                      style={{
                        textDecorationLine: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {item.result.number}
                    </span>
                  </td>
                  <td>{item.result.hash}</td>
                  <td>{parseInt(item.result.gasLimit._hex)}</td>
                  <td>{item.result.transactions.length}</td>
                  <td>
                    {moment
                      .unix(item.result.timestamp)
                      .format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {blockData && (
        <>
          <div style={{marginBottom:'20px'}} >
            <p>
              <span style={{ fontWeight: "bold" }}>
                Showing Transactions from Block Number :
              </span>
              {blockData.result.number}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Block Hash :</span>
              {blockData.result.hash}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Block Gas Limit :</span>
              {parseInt(blockData.result.gasLimit._hex)}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Transaction Count :</span>
              {blockData.result.transactions.length}
            </p>
            <button onClick={backToAllBlocks} >back to all blocks</button>
          </div>
          <table>
            <tbody>
              <tr>
                <th>Transaction Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
              {blockData.result.transactions.map((item) => {
                return (
                  <tr key={item.hash}>
                    <td>{item.hash}</td>
                    <td>{item.from}</td>
                    <td>{item.to}</td>
                    <td>{ethers.utils.formatEther(item.value.toString())} ETH</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
