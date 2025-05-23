'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { XIcon } from 'lucide-react'
import NextLink from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Checkbox } from '@/components/ui/checkbox'
import { BrandLogo } from '@/components/Icons'
import { cn } from '@/lib/utils'
import { useGlobalStore, useUserInfoStore } from '@/store'
import { LoginButton } from '@/components/Button/LoginButton'
import { POLICY_LINK, TERMS_LINK } from '@/constants'
import { isCN } from '@/lib/utils'

export const LoginPanel = () => {
  const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] =
    React.useState<boolean>(false)
  const [showTermsTip, setShowTermsTip] = React.useState<boolean>(false)

  const tLogin = useTranslations('login')
  const { showLoginPanel, setShowLoginPanel } = useGlobalStore()
  const { accountUid } = useUserInfoStore()
  const tooltipTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleClickWithoutPrivacyPolicyAccepted = () => {
    setShowTermsTip(true)
  }

  React.useEffect(() => {
    if (showTermsTip && !tooltipTimerRef.current) {
      tooltipTimerRef.current = setTimeout(() => {
        setShowTermsTip(false)
      }, 3000)
    }
    if (!showTermsTip && tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
      tooltipTimerRef.current = null
    }

    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current)
      }
    }
  }, [showTermsTip])

  if (accountUid) {
    return null
  }

  return (
    <Drawer open={showLoginPanel} onOpenChange={setShowLoginPanel}>
      <DrawerContent className="bg-fill-drawer">
        <div className="relative w-full">
          <div className="mx-auto w-full max-w-sm px-7 py-4 text-icontext">
            <DrawerHeader className="sr-only">
              <DrawerTitle>{tLogin('title')}</DrawerTitle>
            </DrawerHeader>
            <div className="py-10">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'rounded-full border-none bg-block-3 text-icontext-hover hover:bg-brand-main-hover hover:text-icontext',
                  'absolute right-4 top-4',
                  'h-7 w-7 md:h-9 md:w-9 [&_svg]:size-5 md:[&_svg]:size-8'
                )}
                onClick={() => setShowLoginPanel(false)}
              >
                <XIcon />
              </Button>
              <div
                className={cn(
                  'flex items-center justify-between gap-2',
                  'text-xl font-bold'
                )}
              >
                <div className="flex flex-col">
                  <span>{tLogin('panelTitle')}</span>
                  <span>{tLogin('panelDescription')}</span>
                </div>
                <BrandLogo className="size-14" />
              </div>
            </div>
            <DrawerFooter className="mb-10 gap-10 p-0">
              <div className="flex flex-col gap-4">
                <LoginButton
                  variant="ghost"
                  className="h-14 w-full bg-icontext text-lg text-icontext-inverse hover:bg-icontext-hover hover:text-icontext-inverse"
                  onClick={
                    isPrivacyPolicyAccepted
                      ? undefined
                      : handleClickWithoutPrivacyPolicyAccepted
                  }
                >
                  {tLogin('panelButton')}
                </LoginButton>
                {!isCN && (
                  <LoginButton
                    isSignup
                    className={cn(
                      'h-14 w-full rounded-md text-lg text-icontext',
                      'border-line-2 bg-fill-drawer'
                    )}
                    onClick={
                      isPrivacyPolicyAccepted
                        ? undefined
                        : handleClickWithoutPrivacyPolicyAccepted
                    }
                  >
                    {tLogin('panelSignupButton')}
                  </LoginButton>
                )}
              </div>
              <div className={cn('relative flex')}>
                {showTermsTip && (
                  <div
                    className={cn(
                      'absolute -left-[12px] -top-10',
                      'flex w-fit flex-col items-center justify-center',
                      'bg-cover bg-center',
                      'font-size-0 flex items-start',
                      'pointer-events-none'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-[30px] items-center justify-center',
                        'bg-gradient-to-r from-[#A6FAFF] to-[#2884FF]',
                        'rounded-xl px-4 text-sm text-icontext-inverse'
                      )}
                    >
                      {tLogin('buttonTip1')}
                    </span>
                    <div
                      className="h-[6px] min-w-[36px] translate-x-[16px] translate-y-[-1px] bg-contain bg-right-top bg-no-repeat"
                      style={{
                        backgroundImage: 'url(/img/terms-tips.png)',
                      }}
                    ></div>
                  </div>
                )}
                <div
                  className={cn('relative flex gap-2', {
                    'animate-shake': showTermsTip,
                  })}
                >
                  <Checkbox
                    id="terms"
                    checked={isPrivacyPolicyAccepted}
                    className={cn('mt-[3px]', {
                      'border-none ring-offset-transparent':
                        isPrivacyPolicyAccepted,
                      'border-line': !isPrivacyPolicyAccepted,
                    })}
                    onCheckedChange={(checked) => {
                      setShowTermsTip(false)
                      if (checked === true) {
                        setIsPrivacyPolicyAccepted(true)
                      } else {
                        setIsPrivacyPolicyAccepted(false)
                      }
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tLogin.rich('privacyPolicy', {
                      link: (chunks) => (
                        <NextLink
                          href={TERMS_LINK}
                          target="_blank"
                          className="underline"
                        >
                          {chunks}
                        </NextLink>
                      ),
                      policyLink: (chunks) => (
                        <NextLink
                          href={POLICY_LINK}
                          target="_blank"
                          className="underline"
                        >
                          {chunks}
                        </NextLink>
                      ),
                    })}
                  </label>
                </div>
              </div>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
