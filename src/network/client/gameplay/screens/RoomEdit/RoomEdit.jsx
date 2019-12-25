import React from 'react';
import PropTypes from 'prop-types';

import {useHistory} from 'react-router-dom';
import {useI18n} from '@ui/i18n';

import {PLAYER_ACTIONS} from '@game/network/constants/serverCodes';

import {
  Flex,
  Margin,
} from '@ui/basic-components/styled';

import PlayerClientSocket from '../../../protocol/PlayerClientSocket';

import TitledScreen from '../TitledScreen';
import {GameButton} from '../../components/ui';

import MapChooseColumn from './MapChooseColumn';
import RacingConfigColumn from './RacingConfigColumn';
import EditRoomNameForm from './EditRoomNameForm';
import useClientChainListener from '../../hooks/useClientChainListener';

const RoomEdit = ({client, gameBoard}) => { // eslint-disable-line no-unused-vars
  const t = useI18n('game.screens.room_edit');
  const history = useHistory();

  const onLeaveRoom = async () => {
    await client.leaveRoom();
    history.goBack();
  };

  useClientChainListener(
    {
      client,
      action: PLAYER_ACTIONS.YOU_ARE_KICKED,
      method: onLeaveRoom,
      afterReleaseFn: () => {
        gameBoard?.release();
      },
    },
  );

  return (
    <TitledScreen
      header={(
        <Flex direction='row'>
          {t('header')}
          <Margin left={3}>
            <EditRoomNameForm gameBoard={gameBoard} />
          </Margin>

          <Margin left='auto'>
            <GameButton
              type='red'
              onClick={onLeaveRoom}
            >
              {t('leave')}
            </GameButton>
          </Margin>
        </Flex>
      )}
    >
      <Flex direction='row'>
        <div style={{width: '70%'}}>
          <MapChooseColumn gameBoard={gameBoard} />
        </div>

        <div
          style={{
            width: '30%',
            paddingLeft: 20,
          }}
        >
          <RacingConfigColumn gameBoard={gameBoard} />
        </div>
      </Flex>
    </TitledScreen>
  );
};

RoomEdit.displayName = 'RoomEdit';

RoomEdit.propTypes = {
  client: PropTypes.instanceOf(PlayerClientSocket).isRequired,
  gameBoard: PropTypes.any.isRequired,
};

export default React.memo(RoomEdit);
