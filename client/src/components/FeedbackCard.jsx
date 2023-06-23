import React from 'react';
import QuoteLeft from '../svgassets/QuoteLeft';
import QuoteRight from '../svgassets/QuoteRight';
import { Slider } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const PROGRESS = [
  'Below Expected Progress',
  'Making Expected Progress',
  'Above Expected Progress',
];

const ATTAINMENT = [
  'Working towards the national standard',
  'Working at the National Standard',
  'Working at greater depth than the national standard',
];

const EFFORT = [
  'Sometimes tried hard',
  'Tries hard most of the time',
  'Always tries hard',
];

const FeedbackCard = ({ report, onlyProgressBar }) => {
  return (
    <div
      className={`flex-1 ${
        onlyProgressBar ? '' : 'px-[28px] py-[34px]'
      } h-[max-content] max-w-[553px] rounded-lg ${
        onlyProgressBar ? '' : 'bg-[#CFF0FF]'
      }`}
    >
      {!onlyProgressBar && (
        <>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="text-[30px] font-medium text-[#199FDA]">
              {report.subject.subject_name}
            </h1>

            <p className="text-[#199FDA] font-medium flex items-center gap-2">
              <ClockCircleOutlined />
              {dayjs(report.date).format('DD MMM YYYY')}
            </p>
          </div>
          <p className="font-semibold mt-4">Comment</p>
          <p className="text-[13px] relative ml-3 mt-3">
            <QuoteLeft className="absolute -left-3" />
            {report?.comment}
            <span className="text-blue-500 ml-6 cursor-pointer relative">
              <QuoteRight className="absolute top-0 -left-5" />
            </span>
          </p>
        </>
      )}

      <div className="flex items-center mt-4 gap-[40px]">
        <div className="w-full">
          <p className="text-[14px]">Progress</p>
          <p className="text-[13px] my-3 text-[#11a811] font-medium">
            {report.progress}
          </p>
          <Slider
            trackStyle={{
              backgroundColor: '#78B72B',
            }}
            railStyle={{
              backgroundColor: '#ECFFD4',
            }}
            className="progress_slider"
            min={0}
            max={3}
            value={PROGRESS.indexOf(report.progress) + 1}
            tooltip={{
              formatter: (index) => {
                let value = PROGRESS[index - 1];
                return value;
              },
              open: false,
            }}
          />
        </div>
        <div className="w-full">
          <p className="text-[14px]">Attainment</p>
          <p className="text-[13px] my-3 text-[#ED6F1B] font-medium">
            {report.attainment}
          </p>
          <Slider
            trackStyle={{
              backgroundColor: '#ED6F1B',
            }}
            railStyle={{
              backgroundColor: '#FFE6D6',
            }}
            className="attainment_slider"
            min={0}
            max={3}
            value={ATTAINMENT.indexOf(report.attainment) + 1}
            tooltip={{
              formatter: (index) => {
                let value = ATTAINMENT[index - 1];
                return value;
              },
              open: false,
            }}
          />
        </div>
      </div>
      <div className="w-full max-w-[500px]">
        <p className="text-[14px]">Effort</p>
        <p className="text-[13px] my-3 text-[#199FDA] font-medium">
          {report.effort}
        </p>
        <Slider
          trackStyle={{
            backgroundColor: '#199FDA',
          }}
          railStyle={{
            backgroundColor: '#EFFAFF',
          }}
          className="effort_slider"
          min={0}
          max={3}
          value={EFFORT.indexOf(report.effort) + 1}
          tooltip={{
            formatter: (index) => {
              let value = EFFORT[index - 1];
              return value;
            },
            open: false,
          }}
        />
      </div>
    </div>
  );
};

export default FeedbackCard;
