import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ApplyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApplyNoticeModal: React.FC<ApplyNoticeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/5 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle -xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  申请须知
                </Dialog.Title>
                <div className="mt-2 space-y-4">
                  <div className="text-sm text-gray-500">
                    <h4 className="font-medium mb-2">选择星图的理由</h4>
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>搭建wiki所需的服务器和市面现成的主站中关于游戏，账号主页，担心。</li>
                      <li>我们降低了搭建wiki的门槛，架设wiki不需要你有任何写代码的能力，只要你有时间，有搭建wiki的热情，以及一台电脑就可以搭建wiki，可以去各个游戏wiki进行借鉴。</li>
                      <li>我们不对游戏进行限制，各种类型的游戏都可以申请搭建攻略网站。</li>
                      <li>我们也会为wiki版主提供一定的技术或者其方方面的支持。</li>
                      <li>作为打造wiki的版主，我们还会提供更多的网站玩法供大家参与其中的乐趣。</li>
                    </ol>
                  </div>
                  <div className="text-sm text-gray-500">
                    <h4 className="font-medium mb-2">申请wiki的注意事项</h4>
                    <ol className="list-decimal pl-4">
                      <li>我们提供的只是一个wiki建设平台，并不代表对版主拥有任何保护，在本站活动的每位用户，我们会尽量保障你们的权益与建站权限。</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onConfirm}
                  >
                    申请Wiki
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    关闭
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 