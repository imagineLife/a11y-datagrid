import React, { Component } from 'react';

import store from './model/store';
import * as actions from './model/actions';

import DataGridRow from './DataGridRow';

export default class DataGrid extends Component {
  constructor(props) {
    super(props);

    /*this.state = {
      checkedSettings: []
    }*/
  }

  componentWillMount() {
    console.log('DataGrid componentWillMount', this.props);
    let view = this.props.view;
    if(this.props.match.params.namespace) {
      view = Object.assign({}, view, {
        namespace: this.props.match.params.namespace,
        area: this.props.match.params.area,
        xtype: this.props.match.params.xtype,
      });
      store.dispatch(actions.updateView(view));
    }

  }

  componentWillUpdate() {
    const props = this.props;

    //console.log('componentWillUpdate', props, props.match.params.namespace, props.view.namespace);
    /*if(props.match.params.namespace) {
      if(props.match.params.namespace !== props.view.namespace) {
        console.log('updating to', props.match.params.namespace);
        store.dispatch(actions.updateView(Object.assign({}, props.view, {
          namespace: props.match.params.namespace
        })));
      }
    }*/
  }

  checkSetting = (uuid, checked) => {
    //console.log('checkSetting', uuid, checked);
    let checkedSettings = this.props.view.checkedSettings;
    if(checked) {
      checkedSettings.push(uuid);
    } else {
      checkedSettings = checkedSettings.filter((setting) => (setting !== uuid));
    }
    setTimeout(() => {
      /*this.setState({
        checkedSettings
      });*/
      store.dispatch(actions.updateView({
        checkedSettings
      }));
    }, 0);
  }

  render() {
    const props = this.props,
    state = this.state;

    const perPage = !isNaN(props.view.perPage) ? props.view.perPage : 10;

    //console.log(props);
    //console.log(state);

    let filteredSettings = props.filteredSettings;
    //console.log('filteredSettings', filteredSettings);

    if(props.search) {
      const search = props.search.toLowerCase();
      filteredSettings = filteredSettings.filter((setting) => {
        if(setting.uuid.toLowerCase().indexOf(props.search) > -1) {
          return true;
        }
        return false;
      })
    }

    let rows = filteredSettings.map((setting, index) => (
      <DataGridRow key={`${setting.key}`} {...setting} checkSetting={this.checkSetting} />
    ));

    console.log((props.view.page - 1) * perPage, ((props.view.page - 1) * perPage) + perPage);
    rows = rows.slice((props.view.page - 1) * perPage, ((props.view.page - 1) * perPage) + perPage);

    return (
      <table>
        <thead>
          <tr>
            <th className="select">
            <label htmlFor="check_all">

              <input type="checkbox" name="check_all" id="check_all" onChange={(event) => {
                const inputs = document.querySelectorAll('input[name="checked_settings"]'),
                checkedSettings = (event.target.checked) ? filteredSettings : [];

                for(let i = 0; i < inputs.length; i++) {
                  inputs[i].checked = event.target.checked;
                }

                /*this.setState({
                  checkedSettings: checkedSettings
                });*/

                store.dispatch(actions.updateView({
                  checkedSettings

                }));

              }} /> 
              <span className="sometimes visually-hidden" id="select-cell">Select All</span>
            </label>
            </th>
            <th className="name">Name</th>
            <th className="key">Key</th>
            <th className="value">Value</th>
            <th className="last-modified">Last Modified</th>
            <th className="visually-hidden update-setting">Update Setting</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}
