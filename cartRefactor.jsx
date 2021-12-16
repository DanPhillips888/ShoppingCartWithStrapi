// simulate getting products from DataBase
// !! should be able to remove this and just get initial cart from API
const products = 
[ 
  { name: "Apples_:", country: "Italy", cost: 3, instock: 10, numberInCart: 0 },
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3, numberInCart: 0 },
  { name: "Beans__:", country: "USA", cost: 2, instock: 5, numberInCart: 0 },
  { name: "Cabbage:", country: "USA", cost: 1, instock: 8, numberInCart: 0 },
];

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/products",
    {
      data: [],
    }
  );
  //console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    
    if (item[0].instock == 0) {
      alert("Insufficient Stock");
      return;
    } 
    //REFACTOR to change stock number of item already in cart
    // check for empty cart
    if (cart.length === 0) {
      item[0].instock --;
      console.log(`first item added to Cart ${JSON.stringify(item)}`);
      item[0].numberInCart++;
      setCart([...cart, ...item]);
      return;
    }
    
    //function to check for item already in cart
    function itemInCart() {
      let allItemsInCart = [...cart];
      for (let i=0; i <= allItemsInCart.length -1; i++) {
        // end of loop reached with no match, add new item
        if (allItemsInCart[i].name !== item[0].name && i === allItemsInCart.length-1) {
          item[0].instock--;
          item[0].numberInCart++;
          //console.log(`add new item to Cart ${item.name} in cart ${item.numberInCart}`);
          setCart([...cart, ...item]);
          return;
        };
        //continue if not matching
        if (allItemsInCart[i].name !== item[0].name) {
          console.log("continuing");
          continue;
        }
        //item name matches item name in the cart
        if (allItemsInCart[i].name === item[0].name) {
          let itemInCart = allItemsInCart[i];
          itemInCart.instock--;
          item[0].numberInCart++;
          console.log(`item already in cart, ${itemInCart.name} instock ${itemInCart.instock} in cart ${itemInCart.numberInCart}`);
          setCart([...cart]);
          return;
        }
      }
    }
    itemInCart();
    //console.log(`item in cart ${itemInCart()}`);
    
    //doFetch(query);
  };
  console.log(`Render cart ${JSON.stringify(cart)}`);
  //REFACTOR to remove only 1 item in cart not all 
  //index here is index in the cart not the product list index
  const deleteCartItem = (delIndex) => {
    if (cart[delIndex].numberInCart === 1) {
      //remove item from cart list
      let newCart = cart.filter((item, i) => delIndex != i);
      let target = cart.filter((item, index) => delIndex ==index);
      let newItems = items.map((item, index) => {
        if (item.name == target[0].name) item.instock++;
        return item;
      });
      setCart(newCart);
      setItems(newItems);
      console.log(`item removed ${cart[delIndex].name}`);
      return;
    }
    if (cart[delIndex].numberInCart > 1) {
      let itemsInCart = [...cart];
      let target = itemsInCart[delIndex];
      let updateItem = (target) => {
        target.instock++
        target.numberInCart--;
      }
      updateItem(target);
      console.log(`item removed ${target.name}`);
      setCart([...cart]);
    }  
    return;
    }
  };

  // const photos = ["apple.png", "orange.png", "beans.png", "cabbage.png"];
  //Product list 
  let list = items.map((item, index) => {
    let n = index + 1049;
    let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        {/* photos[index % 4] */}
        <Image src={url} width={70} roundedCircle></Image>
        <Button variant="primary" size="large">
          {item.name}:${item.cost}  Stock={item.instock}
        </Button>
        <input name={item.name} type="submit" onClick={addToCart}></input>
      </li>
    );
  });

//Cart contents format
  let cartList = cart.map((item, index) => {
    return (
      <Card className="m-2" key={1 + index}>
					<Accordion.Item eventkey={1 + index}>
					<Accordion.Header variant="link" eventkey={1 + index}>
					{item.name} 
					</Accordion.Header>
					<Accordion.Body eventkey={1 + index}>
          Number in Cart: {item.numberInCart} <br/>
					From {item.country}: ${item.cost}
					<hr />
					<Button className="btn btn-danger"
          onClick={() => deleteCartItem(index)}
					eventkey={1 + index}>
					Delete
					</Button>
					</Accordion.Body>
					</Accordion.Item>
					</Card>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name} {item.numberInCart}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let itemsInCart = [...cart];
    let newTotal = 0;
    for (let i=0; i <= itemsInCart.length -1; i++) {
      let costItem = itemsInCart[i].cost * itemsInCart[i].numberInCart;
      newTotal += costItem;
    }
    return newTotal;
  };
  
  const restockProducts = (url) => {
    doFetch(url);
    let newItems = data.map((item) => {
      let { name, country, cost, instock } = item;
      return {name, country, cost, instock};
    });
    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
