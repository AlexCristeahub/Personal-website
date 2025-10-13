"use client"

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, User, Calendar as CalendarIcon } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingCalendarProps {
  availableSlots?: TimeSlot[]
  bookedDates?: Date[]
  onBooking?: (date: Date, time: string) => void
  showHeader?: boolean
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availableSlots = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
  ],
  bookedDates = [
    new Date(2024, 11, 15),
    new Date(2024, 11, 20),
    new Date(2024, 11, 25),
  ],
  onBooking = (date: Date, time: string) => {
    console.log(`Booking scheduled for ${date.toDateString()} at ${time}`)
  },
  showHeader = true
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isBooked, setIsBooked] = useState(false)

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    )
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime("")
    setIsBooked(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      onBooking(selectedDate, selectedTime)
      setIsBooked(true)
    }
  }

  const modifiers = {
    booked: bookedDates,
  }

  const modifiersStyles = {
    booked: {
      backgroundColor: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
      textDecoration: 'line-through'
    }
  }

  return (
    <div className={showHeader ? "w-full max-w-4xl mx-auto" : "w-full"}>
      {showHeader && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Book a Call</h2>
          <p className="text-muted-foreground">Let's talk about startups and innovation. Yes, of course it's free</p>
        </div>
      )}

      <div className={showHeader ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "space-y-6"}>
        {/* Calendar Section */}
        {showHeader ? (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || isDateBooked(date)}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border-border"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            <h3 className="flex items-center gap-2 text-foreground font-semibold mb-4">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || isDateBooked(date)}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border-border mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        )}

        {/* Time Slots & Booking Section */}
        {showHeader ? (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="w-5 h-5" />
                Available Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedDate ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate.toDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className="justify-center"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {selectedTime && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <h3 className="font-semibold text-foreground mb-2">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedDate.toDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>30 minute call</span>
                          </div>
                        </div>
                      </div>

                      {!isBooked ? (
                        <Button 
                          onClick={handleBooking}
                          className="w-full"
                          size="lg"
                        >
                          Confirm Booking
                        </Button>
                      ) : (
                        <div className="text-center space-y-2">
                          <Badge variant="default" className="text-sm">
                            Booking Confirmed
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            You'll receive a confirmation email shortly
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Please select a date to view available times
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div>
            <h3 className="flex items-center gap-2 text-foreground font-semibold mb-4">
              <Clock className="w-5 h-5" />
              Available Times
            </h3>
            <div className="space-y-6">
              {selectedDate ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate.toDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className="justify-center"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {selectedTime && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <h3 className="font-semibold text-foreground mb-2">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedDate.toDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>30 minute call</span>
                          </div>
                        </div>
                      </div>

                      {!isBooked ? (
                        <Button 
                          onClick={handleBooking}
                          className="w-full"
                          size="lg"
                        >
                          Confirm Booking
                        </Button>
                      ) : (
                        <div className="text-center space-y-2">
                          <Badge variant="default" className="text-sm">
                            Booking Confirmed
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            You'll receive a confirmation email shortly
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Please select a date to view available times
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingCalendar