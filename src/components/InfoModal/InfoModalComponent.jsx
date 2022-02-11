/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Button, Modal } from "semantic-ui-react";

export default ({ open, onOpen, onClose, header, content, trigger }) => {
  return (
    <Modal onClose={onClose} onOpen={onOpen} open={open} trigger={trigger}>
      {header && <Modal.Header>{header}</Modal.Header>}
      <Modal.Content>
        <Modal.Description>{content}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Fechar" onClick={onClose} />
      </Modal.Actions>
    </Modal>
  );
};
