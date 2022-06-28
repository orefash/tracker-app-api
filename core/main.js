

const { sendPostRequest, otpGenerate } = require("./utils.js");
const { getDb } = require("../db/conn.js");
const { Response } = require("node-fetch");



const userData = [
    {
        "Flat_Rate": "10",
        "Industry": "PUBLIC ADMINISTRATION- FEDERAL & LAGOS",
        "AccountNumber": "2200000016",
        "BankName": "FIRST CITY MONUMENT BANK",
        "BankCode": "000003",
        "Name": "ADEGBOLA JOSEPHINE",
        "Mobile": "08011425211",
        "ippisNo": "203202",
        "Loan": {
            "1": "54986.85",
            "2": "100000.00",
            "3": "100000.00"
        }
    },
    {
        "Flat_Rate": "10",
        "Industry": "PUBLIC ADMINISTRATION- FEDERAL & LAGOS",
        "AccountNumber": "1700003644",
        "BankName": "SKYE BANK PLC",
        "BankCode": "000008",
        "Name": "SAMUEL FELICIA",
        "Mobile": "08032338314",
        "ippisNo": "202212",
        "Loan": {
            "1": "86345.56",
            "2": "100000.00",
            "3": "100000.00"
        }
    },
    {
        "Flat_Rate": "10",
        "Industry": "PUBLIC ADMINISTRATION- FEDERAL & LAGOS",
        "AccountNumber": "2006232068",
        "BankName": "FIRST BANK OF NIGERIA PLC",
        "BankCode": "000016",
        "Name": "OLANIYI OLADELE",
        "Mobile": "08067230433",
        "ippisNo": "203212",
        "Loan": {
            "1": "100000.00",
            "2": "100000.00",
            "3": "100000.00"
        }
    }
]

async function findCustomerbyValue(vtype, value){

    let customer = userData.find(function (ele) {
        return ele[vtype] === value;
    });

    return customer
}

async function verifyIppis(data) {

    let customer = await findCustomerbyValue("ippisNo", data.vser[0].ippis)

    if(!customer)
        return {
            "Resp": "2",
            "Desc": "Ippis not on our Record"
        }
    
    customer.Resp = "0"
    customer.Desc = "successful"

    return customer

}

async function verifyPhone(data) {

    let customer = await findCustomerbyValue("Mobile", data.vser[0].ippis)

    if(!customer)
        return {
            "Resp": "2",
            "Desc": "Phone Number not on our Record"
        }
    
    customer.Resp = "0"
    customer.Desc = "successful"

    return customer

}

async function bookLoan(data) {

    // console.log("Data: ", data)

    let client = await getDb();

    let resp = {
        "Resp": 0
    }

    try {
        await client.connect()
        
        let result = await client.db("pp-bot").collection("demo-loans").findOne({ ippis: data.vser[0].ippis })
        let Stat = []
        if(result) {
            Stat.push({Response: "Dear Customer, you have an account with us with a running loan"})
            resp.Stat = Stat
        } else {
            let loan_data = data.vser[0];
            loan_data.createdAt = new Date();
            // console.log("Data: ", loan_data)

            let insertRec = await client.db("pp-bot").collection("demo-loans").insertOne(data.vser[0]);
            // console.log("Insert id: ", insertRec)
            Stat.push({Response: "Dear Customer, you have successfully booked a loan"})
            resp.Stat = Stat
        }

    } catch (error) {
        console.error(error)
    }

    return resp
}


async function getLoanBalance(data) {

    // console.log("Data: ", data.vser[0].ippis)

    let client = await getDb();

    let resp = {
        "Resp": 2
    }

    try {
        await client.connect()
        
        let result = await client.db("pp-bot").collection("demo-loans").findOne({ ippis: data.vser[0].ippis })
        if(result) {
            resp.Resp = "0"
            resp.Desc = "Successful"
            resp.LiqAmount = result.amount
        } 

    } catch (error) {
        console.error(error)
    }

    return resp
}

const requestMap = {
    "verify_ippis_phone": verifyPhone,
    "verify_ippis": verifyIppis,    
    "book_ippis": bookLoan,
    "get_loan_bal": getLoanBalance
}

async function storeBankPage(data) {

    let client = await getDb();

    try {
        await client.connect();
        let result = await client.db("pp-bot").collection("demo-bank").insertOne(data);

        // console.log("In store: ", result)

        // res.status(200).json({ ok: true })
    } catch (error) {
        console.error(error)
        // res.status(500).json({ err: err })
    }
    // finally{
    //   await client.close()
    // }


}

let merchant_list = "\n1. Merchant 1\n2. Merchant 2\n3. Merchant 3"
let merchant_obj = {
    "1" : "Merchant 1",
    "2" : "Merchant 2",
    "3" : "Merchant 3"
}


module.exports = {

    sendOtp: async (data) => {
        let otp_data = await otpGenerate(5);

        data.vser[0].otp = otp_data;

        return { fstatus: 20, otp: otp_data }
    },


    getVendors: async (data) => {

        return { fstatus: 02, merchants: merchant_list };

    },

    checkVendor: async (data) => {

        const mid = data.mid;

        if(!merchant_obj[mid])
            return { fstatus: 5, merchants: "" }

        return {
            fstatus: 2,
            mid: mid,
            name: merchant_obj[mid]
        };

    },

    handleRequest: async (data) => {

        // console.log("Data: ", requestMap[data.vser[0].reqType])

        if (!requestMap[data.vser[0].reqType]) return { fstatus: 33, Desc: "Process error" }      

        return await requestMap[data.vser[0].reqType](data);

    },


    checkBank: async (data) => {
        let spage = data.page;
        let bchoice = data.choice;
        let appBank = data.approved_bank.toLowerCase();

        // console.log("Data;: ", data)


        let resp_data = { fstatus: 33, match: 1 };

        if (spage) {

            let client = await getDb();

            try {
                await client.connect();
                let result = await client.db("pp-bot").collection("demo-bank").findOne({ page: spage });
                // console.log("Data: "+appBank+" : ")
                if (result) {
                    // console.log("result bata: ", result.bank_data)
                    let bdata = result.bank_data[bchoice - 1]
                    // let bdata = result.bank_data[1]

                    // console.log("bata: ", bdata)

                    let selectedBank = bdata.bank.toLowerCase();
                    // console.log("Data: approved:- " + appBank + " : selected: " + selectedBank)

                    if (appBank.includes(selectedBank)) resp_data.match = 0;

                    resp_data.bank = bdata.bank;
                    resp_data.fstatus = 20;

                }


                // res.status(200).json({ ok: true })
            } catch (error) {
                console.error(error)
                // res.status(500).json({ err: error })
            } finally {
                await client.close()
            }


        }

        return resp_data;

    },

    getBanks: async (data) => {

        let spage = data.page;

        let resp_data = { fstatus: 33 };

        let client = await getDb();

        try {
            await client.connect();
            let result = await client.db("pp-bot").collection("demo-bank").findOne({ page: spage });
            // console.log("find result: ", result)
            if (result) {
                resp_data.fstatus = 20;
                resp_data.bank_list = result.bank_list;

                // res.status(200).json(resp_data)
            } else {

                const resp = await sendPostRequest(data);

                if (resp && resp.Resp === "0") {

                    let bList = resp.Stat;

                    // console.log(bList)

                    let count = 1;
                    let dList = [];
                    let lst = [], page = 1, bstring = "";

                    bList.forEach(e => {
                        if (count < 10) {
                            lst.push({ id: count, bank: e.bank })
                            bstring += "" + count + ". " + e.bank + "\n";
                            count++;
                        } else {

                            let bdata = {
                                page: page,
                                bank_data: lst,
                                bank_list: bstring
                            };

                            if (spage == page) {
                                resp_data.fstatus = 20;
                                resp_data.bank_list = bstring;

                            }
                            storeBankPage(bdata)

                            page++;
                            lst = [];
                            bstring = "";
                            count = 1
                        }


                    });

                    // console.log("DList: ", dList)


                    // res.json(resp);
                }


            }

        } catch (error) {
            console.error(err)
            // res.status(500).json({ err: err })
        } finally {
            // await client.close()
        }

        return resp_data;

    }
};