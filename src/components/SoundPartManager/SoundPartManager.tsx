import * as React from 'react';
import Sound from '../Sound/Sound';
import { getItemFromId, getEditedIndex } from '../../helpers/arrayHelper';
import { ComponentPropsListener } from '../../Objects/ComponentPropsListener';
import { cx } from 'emotion';
import s from '../../styles';
import { iSound } from '../../managers/types/sound.type';
import { iPart } from '../../managers/types/part.type';
import { iSoundControls } from '../../managers/types/control.type';
import { iComponentEvent } from '../../managers/types/componentEvent.type';

interface Props {
    part: iPart[]
    sounds: iSound[]
    controls: iSoundControls[]
    onUpdate: Function
    onTriggerSoundEdit: Function
    onRemoveSound: Function
    eventIn: iComponentEvent
}

interface State {

}

export default class SoundPartManager extends React.Component<Props,State> {

    propsListener: ComponentPropsListener
    constructor(props) {
        super(props)
        this.propsListener = new ComponentPropsListener({
            'eventIn': () => {
                let event = this.props.eventIn
                console.log(333, event)
                let editedIndex = getEditedIndex(this.props.sounds)
                if (event.action === 'list.up') this.props.onTriggerSoundEdit(this.props.sounds[editedIndex - 1]) 
                if (event.action === 'list.down') this.props.onTriggerSoundEdit(this.props.sounds[editedIndex + 1]) 
                if (event.action === 'sound.delete') this.props.onRemoveSound(this.props.sounds[editedIndex]) 
                if (event.action === 'sound.play')  (this.refs[`sound-${editedIndex}`] as Sound).togglePlay()
                if (event.action === 'sound.pause') (this.refs[`sound-${editedIndex}`] as Sound).togglePlay()
            },
        })
    }
    componentDidUpdate = () => { this.propsListener.listen(this.props) }

    render() {
        return (
            <div className="sounds" >
                <h3>Part Sounds Manager</h3>
                <div className="sounds" >
                    <h3> Sounds </h3>
                    <ul>
                        {
                            this.props.sounds.map((sound,i) => (
                                <li key={i} className={cx( sound.edited && s.sound.active)}>
                                    <Sound 
                                        ref={`sound-${i}`}
                                        sound={sound}   
                                        controls={getItemFromId(sound.id,this.props.controls).controls}
                                        playable={true}
                                        onEdit={this.props.onTriggerSoundEdit}
                                        onDelete={this.props.onRemoveSound}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        )
    }   
}