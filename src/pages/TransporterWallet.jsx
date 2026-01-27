import React,{useEffect,useState} from "react";
import api from "../api/axiosInstance";

export default function TransporterWallet(){

  const [balance,setBalance] = useState(0);
  const [txns,setTxns] = useState([]);

  const user = JSON.parse(localStorage.getItem("user_context")||"{}");
  const gdc = user?.gdc_number;

  useEffect(()=>{
    load();
  },[]);

  const load = async()=>{

    const w = await api.get(`/api/wallets/${gdc}/TRANSPORTER`);
    setBalance(w.data.balance);

    const t = await api.get(`/api/wallets/transactions/${gdc}/TRANSPORTER`);
    setTxns(t.data || []);
  };

  return(

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Wallet</h1>

      <div className="bg-green-100 rounded-xl p-4 mb-6 text-xl font-bold">
        Balance : ₹{balance}
      </div>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Type</th>
            <th>Purpose</th>
            <th>Amount</th>
            <th>Closing</th>
          </tr>
        </thead>

        <tbody>
          {txns.map((t,i)=>(
            <tr key={i} className="border-t">
              <td className="p-2">{t.txnType}</td>
              <td>{t.purpose}</td>
              <td>₹{t.amount}</td>
              <td>₹{t.closingBalance}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
