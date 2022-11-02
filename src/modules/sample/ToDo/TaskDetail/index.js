import React, {useEffect} from 'react';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailBody from './TaskDetailBody';
import {useDispatch, useSelector} from 'react-redux';
import {onGetSelectedTask} from '../../../../redux/actions';
import AppsHeader from '@crema/core/AppsContainer/AppsHeader';
import AppsContent from '@crema/core/AppsContainer/AppsContent';
import {MailDetailSkeleton} from '@crema/core/AppSkeleton/MailDetailSkeleton';
import {useRouter} from 'next/router';

const TaskDetail = () => {
  const dispatch = useDispatch();

  const {query} = useRouter();
  useEffect(() => {
    dispatch(onGetSelectedTask(query.all[query.all.length - 1]));
  }, [dispatch, query.all[query.all.length - 1]]);

  const selectedTask = useSelector(({todoApp}) => todoApp.selectedTask);

  if (!selectedTask) {
    return <MailDetailSkeleton />;
  }
  return (
    <>
      <AppsHeader>
        <TaskDetailHeader selectedTask={selectedTask} />
      </AppsHeader>
      <AppsContent isDetailView>
        <TaskDetailBody selectedTask={selectedTask} />
      </AppsContent>
    </>
  );
};

export default TaskDetail;
