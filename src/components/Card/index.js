import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import BoardContext from "../Board/context";

import { Container, Label } from "./styles";

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  // getting function move by board's context
  const { move } = useContext(BoardContext);
  // register drag reference to card
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "CARD", index, id: data.id, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  // register drop reference to card
  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      // index by drag and drop lists
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;
      // index by drag and drop cards
      const draggedIndex = item.index;
      const targetIndex = index;
      // interrupt when moving card stay hover same card
      if (item.id === data.id) {
        return;
      }
      // card drop reference
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;
      // moving card
      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      // interrupts if it is being placed in the same position
      const stayBefore =
        draggedIndex < targetIndex && draggedTop < targetCenter;
      const stayAfter = draggedIndex > targetIndex && draggedTop > targetCenter;
      if (stayBefore || stayAfter) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      // update card index and card list index
      item.index = targetIndex;
      item.listIndex = listIndex;
    }
  });

  // use ref by hook to pass multiple reference
  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="" />}
    </Container>
  );
}
